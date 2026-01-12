package com.SAGE.sageWebsite.controller;

import com.SAGE.sageWebsite.model.Article;
import com.SAGE.sageWebsite.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    // DTO for incoming article content
    static class ArticleContent {
        public String title;
        public String author;
        public String content;
    }

    static class StatusUpdate {
        public String status;
    }

    private final ArticleService articleService;
    private final com.SAGE.sageWebsite.repository.UserRepository userRepository;

    @Autowired
    public ArticleController(ArticleService articleService,
            com.SAGE.sageWebsite.repository.UserRepository userRepository) {
        this.articleService = articleService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Integer id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody ArticleContent articleContent,
            java.security.Principal principal) {
        System.out.println("Applying Article Upload Security Filter Chain...");
        if (principal == null) {
            System.out.println("Processing Upload Request: 403 Forbidden - User not authenticated");
            return ResponseEntity.status(403).build();
        }

        return userRepository.findByEmail(principal.getName())
                .map(user -> {
                    Article article = new Article();
                    article.setTitle(articleContent.title);
                    article.setAuthor(articleContent.author);
                    article.setContent(articleContent.content);
                    article.setUserId(user.getId());
                    article.setPublishedDate(java.time.LocalDateTime.now());

                    Article savedArticle = articleService.saveArticle(article);
                    System.out.println(
                            "Processing Upload Request: 200 OK - Article created successfully by user " + user.getId());
                    return ResponseEntity.ok(savedArticle);
                })
                .orElseGet(() -> {
                    System.out.println("Processing Upload Request: 401 Unauthorized - User not found in DB");
                    return ResponseEntity.status(401).build();
                });
    }

    @GetMapping("/my")
    public ResponseEntity<List<Article>> getMyArticles(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(403).build();
        }
        return userRepository.findByEmail(principal.getName())
                .map(user -> {
                    List<Article> articles = articleService.getArticlesByUserId(user.getId());
                    return ResponseEntity.ok(articles);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Article> updateStatus(@PathVariable Integer id, @RequestBody StatusUpdate statusUpdate,
            java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(403).build();
        }
        // In a real app, verify user role here (e.g. only admin/officer)
        return userRepository.findByEmail(principal.getName())
                .map(user -> {
                    try {
                        Article updated = articleService.updateArticleStatus(id, statusUpdate.status);
                        return ResponseEntity.ok(updated);
                    } catch (RuntimeException e) {
                        return ResponseEntity.status(404).<Article>build();
                    }
                })
                .orElse(ResponseEntity.status(401).build());
    }

}
