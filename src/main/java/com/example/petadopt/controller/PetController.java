package com.example.petadopt.controller;

import com.example.petadopt.entity.Pet;
import com.example.petadopt.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pet")
public class PetController {
    @Autowired
    private PetService petService;

    // 获取可领养宠物列表
    @GetMapping("/available")
    public String getAvailablePets() {
        List<Pet> pets = petService.getAvailablePets();
        return String.format("{\"code\":1,\"msg\":\"成功\",\"data\":%s}", pets);
    }

    // 获取宠物详情
    @GetMapping("/{id}")
    public String getPetById(@PathVariable Integer id) {
        Pet pet = petService.getPetById(id);
        if (pet != null) {
            return String.format("{\"code\":1,\"msg\":\"成功\",\"data\":%s}", pet);
        } else {
            return "{\"code\":0,\"msg\":\"宠物不存在\",\"data\":null}";
        }
    }

    // 新增宠物（管理员操作）
    @PostMapping
    public String addPet(@RequestBody Pet pet) {
        boolean success = petService.addPet(pet);
        return success ? "{\"code\":1,\"msg\":\"宠物添加成功\",\"data\":null}" : "{\"code\":0,\"msg\":\"添加失败\",\"data\":null}";
    }

    // 更新宠物状态
    @PutMapping("/status/{id}")
    public String updatePetStatus(@PathVariable Integer id, @RequestParam String status) {
        boolean success = petService.updatePetStatus(id, status);
        return success ? "{\"code\":1,\"msg\":\"状态更新成功\",\"data\":null}" : "{\"code\":0,\"msg\":\"更新失败\",\"data\":null}";
    }
}