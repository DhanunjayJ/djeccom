package com.dj.eccom_backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale=2)
    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @NotBlank
    private String category;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean active = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        if (active == null) {
            active = true;
        }
    }

}
