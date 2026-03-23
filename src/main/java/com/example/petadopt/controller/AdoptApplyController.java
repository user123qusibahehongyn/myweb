package com.example.petadopt.controller;

import com.example.petadopt.entity.AdoptApply;
import com.example.petadopt.service.AdoptApplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adopt/apply")
public class AdoptApplyController {
    @Autowired
    private AdoptApplyService adoptApplyService;

    // 根据ID查询申请
    @GetMapping("/{id}")
    public AdoptApply getById(@PathVariable Long id) {
        return adoptApplyService.getAdoptApplyById(id);
    }

    // 查询所有申请
    @GetMapping("/list")
    public List<AdoptApply> getAll() {
        return adoptApplyService.getAllAdoptApplies();
    }

    // 提交领养申请（新增）
    @PostMapping
    public String add(@RequestBody AdoptApply adoptApply) {
        int result = adoptApplyService.addAdoptApply(adoptApply);
        return result > 0 ? "申请提交成功！" : "申请提交失败，请重试";
    }

    // 更新申请
    @PutMapping
    public String update(@RequestBody AdoptApply adoptApply) {
        int result = adoptApplyService.updateAdoptApply(adoptApply);
        return result > 0 ? "申请更新成功！" : "申请更新失败，请重试";
    }

    // 删除申请
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        int result = adoptApplyService.deleteAdoptApply(id);
        return result > 0 ? "申请删除成功！" : "申请删除失败，请重试";
    }
}