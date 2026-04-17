package com.customchef.backend.service.dto;

public class FeedbackDto {
    private String source;
    private Integer rating;
    private Boolean hadProblems;
    private String suggestions;

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public Boolean getHadProblems() { return hadProblems; }
    public void setHadProblems(Boolean hadProblems) { this.hadProblems = hadProblems; }
    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }
}