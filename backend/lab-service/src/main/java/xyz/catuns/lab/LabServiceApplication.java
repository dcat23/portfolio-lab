package xyz.catuns.lab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class LabServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LabServiceApplication.class, args);
	}

}
