package com.SAGE.sageWebsite.service;

import com.SAGE.sageWebsite.model.Article;
import com.SAGE.sageWebsite.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Autowired
    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Optional<Article> getArticleById(Integer id) {
        return articleRepository.findById(id);
    }

    public Article saveArticle(Article article) {
        return articleRepository.save(article);
    }

    public List<Article> getArticlesByUserId(Integer userId) {
        return articleRepository.findByUserId(userId);
    }

    public Article updateArticleStatus(Integer id, String status) {
        return articleRepository.findById(id).map(article -> {
            article.setStatus(status);
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found with id " + id));
    }

    public void deleteArticle(Integer id) {
        articleRepository.deleteById(id);
    }

}
