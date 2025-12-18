package com.SAGE.sageWebsite.service;

import com.SAGE.sageWebsite.model.Article;
import com.SAGE.sageWebsite.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

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
        if (article.getContent() != null) {
            String sanitizedContent = Jsoup.clean(article.getContent(), Safelist.relaxed());
            article.setContent(sanitizedContent);
        }
        return articleRepository.save(article);
    }

    public void deleteArticle(Integer id) {
        articleRepository.deleteById(id);
    }
}
