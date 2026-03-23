package com.example.petadopt.service;

import com.example.petadopt.entity.Pet;
import com.example.petadopt.mapper.PetMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {
    @Autowired
    private PetMapper petMapper;

    // 获取所有可领养宠物
    public List<Pet> getAvailablePets() {
        return petMapper.findAvailablePets();
    }

    // 获取宠物详情
    public Pet getPetById(Integer id) {
        return petMapper.findPetById(id);
    }

    // 新增宠物
    public boolean addPet(Pet pet) {
        // 默认状态为可领养
        if (pet.getStatus() == null) {
            pet.setStatus("available");
        }
        return petMapper.insertPet(pet) > 0;
    }

    // 更新宠物状态（如审核中/已领养）
    public boolean updatePetStatus(Integer id, String status) {
        return petMapper.updatePetStatus(id, status) > 0;
    }

    // 获取所有宠物（含所有状态）
    public List<Pet> getAllPets() {
        return petMapper.findAllPets();
    }
}