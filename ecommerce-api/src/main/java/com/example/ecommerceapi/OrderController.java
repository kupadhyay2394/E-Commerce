package com.example.ecommerceapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private PurchaseOrderRepository orderRepository;

    // POST /api/orders/buy
    // This creates a new order
    @PostMapping("/buy")
    public PurchaseOrder buyProduct(@RequestBody OrderRequest orderRequest) {
        PurchaseOrder order = new PurchaseOrder();
        
        order.setProductId(orderRequest.getProductId());
        order.setProductName(orderRequest.getProductName());
        order.setPriceAtPurchase(orderRequest.getPrice());
        
        // The @PrePersist annotation in PurchaseOrder.java
        // will automatically set the purchaseDate
        
        return orderRepository.save(order);
    }

    // GET /api/orders
    // This lets us see all completed orders
    @GetMapping
    public List<PurchaseOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}