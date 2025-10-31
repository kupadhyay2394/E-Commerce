package com.example.ecommerceapi;

// This is a DTO (Data Transfer Object)
// It defines the shape of the JSON request to buy a product
public class OrderRequest {
    private Long productId;
    private String productName;
    private double price;

    // Getters and Setters are needed for Jackson (JSON converter)
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
}