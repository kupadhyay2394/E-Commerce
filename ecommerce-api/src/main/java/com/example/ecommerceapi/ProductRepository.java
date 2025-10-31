package com.example.ecommerceapi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // This interface gives you all database methods:
    // .save()
    // .findById()
    // .findAll()
    // .deleteById()
    // ...and many more, automatically!
}