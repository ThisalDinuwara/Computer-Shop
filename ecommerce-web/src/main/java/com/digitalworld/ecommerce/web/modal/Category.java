package com.digitalworld.ecommerce.web.modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @Column(name = "category_id", nullable = false, unique = true)  // ✅ Add constraints
    private String categoryId;

    @ManyToOne
    @JoinColumn(name = "parent_category_id")  // ✅ Specify column name
    private Category parentCategory;

    @Column(nullable = false)
    private Integer level;

}
