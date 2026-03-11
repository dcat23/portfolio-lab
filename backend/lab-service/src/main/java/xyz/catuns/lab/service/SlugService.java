package xyz.catuns.lab.service;

public interface SlugService {

    String generateUniqueSlug(String title, Long excludeId);
}
