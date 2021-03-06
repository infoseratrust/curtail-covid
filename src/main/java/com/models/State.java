package com.models;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
public class State {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToMany
    private List<District> districts;
}
