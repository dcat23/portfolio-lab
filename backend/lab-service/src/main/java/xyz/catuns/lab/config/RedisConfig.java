package xyz.catuns.lab.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class RedisConfig {
    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    @Value("${spring.data.redis.ssl.enabled:false}")
    private boolean sslEnabled;

//    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisHost);
        redisConfig.setPort(redisPort);
        if (redisPassword != null && !redisPassword.isEmpty()) {
            redisConfig.setPassword(redisPassword);
        }

        LettuceClientConfiguration clientConfig;
        log.info("Ssl enabled {}", sslEnabled);
        if (sslEnabled) {

            clientConfig = LettuceClientConfiguration.builder()
                    .commandTimeout(Duration.ofSeconds(2))
                    .shutdownTimeout(Duration.ofMillis(100))
                    .useSsl()
                    .disablePeerVerification()
                    .build();
        } else {
            clientConfig = LettuceClientConfiguration.builder()
                    .commandTimeout(Duration.ofSeconds(2))
                    .shutdownTimeout(Duration.ofMillis(100))
                    .build();
        }

        return new LettuceConnectionFactory(redisConfig, clientConfig);
    }

//    @Bean
    public RedisTemplate<String, Long> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Long> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericToStringSerializer<>(Long.class));
        return template;
    }

    @Bean
    public RedisSerializer<UUID> cacheKeySerializer() {
        return new RedisSerializer<UUID>() {
            @Override
            public byte[] serialize(UUID obj) throws SerializationException {
                if (obj == null) {
                    return new byte[0];
                }
                String key = obj.toString();
                return key.getBytes(StandardCharsets.UTF_8);
            }

            @Override
            public UUID deserialize(byte[] bytes) throws SerializationException {
                if (bytes == null || bytes.length == 0) {
                    return null;
                }
                return UUID.nameUUIDFromBytes(bytes);
            }
        };
    }

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        ObjectMapper objectMapper = redisObjectMapper();

        GenericJackson2JsonRedisSerializer serializer =
                new GenericJackson2JsonRedisSerializer(objectMapper);

        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new StringRedisSerializer()
                        )
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(serializer)
                )
                .disableCachingNullValues();

    }

    private static ObjectMapper redisObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.findAndRegisterModules();

//        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);

        objectMapper.activateDefaultTyping(
                BasicPolymorphicTypeValidator.builder()
                        .allowIfSubType(Object.class)
                        .build(),
//                ObjectMapper.DefaultTyping.NON_FINAL,
                ObjectMapper.DefaultTyping.EVERYTHING,
                JsonTypeInfo.As.PROPERTY
        );
        return objectMapper;
    }

}
