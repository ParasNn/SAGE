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

    private final ArticleService articleService;

    @Autowired
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
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
    public Article createArticle(@RequestBody Article article) {
        return articleService.saveArticle(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Integer id, @RequestBody Article articleDetails) {
        return articleService.getArticleById(id)
                .map(existingArticle -> {
                    existingArticle.setTitle(articleDetails.getTitle());
                    existingArticle.setContent(articleDetails.getContent());
                    existingArticle.setAuthor(articleDetails.getAuthor());
                    if (articleDetails.getPublishedDate() != null) {
                        existingArticle.setPublishedDate(articleDetails.getPublishedDate());
                    }
                    return ResponseEntity.ok(articleService.saveArticle(existingArticle));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Integer id) {
        if (articleService.getArticleById(id).isPresent()) {
            articleService.deleteArticle(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
