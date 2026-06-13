package com.wallet_service.wallet_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

public interface BaseController<DTO, ID> {

    @GetMapping
    ResponseEntity<List<DTO>> getAll();

    @GetMapping("/{id}")
    ResponseEntity<DTO> getById(@PathVariable ID id);

    @PostMapping
    ResponseEntity<DTO> create(@RequestBody DTO request);

    @PutMapping
    ResponseEntity<DTO> update(@RequestBody DTO request);

    @DeleteMapping("/{id}")
    ResponseEntity<Map<String, String>> delete(@PathVariable ID id);
}