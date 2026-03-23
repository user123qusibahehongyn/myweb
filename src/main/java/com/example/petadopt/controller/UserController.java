package com.example.petadopt.controller;

import com.example.petadopt.entity.User;
import com.example.petadopt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// 通用返回类（如果你的项目里已有Result类，保留；没有则先注释，仅保证编译）
class Result<T> {
    private Integer code;
    private String msg;
    private T data;

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.code = 200;
        result.msg = "操作成功";
        result.data = data;
        return result;
    }

    public static <T> Result<T> error(String msg) {
        Result<T> result = new Result<>();
        result.code = 500;
        result.msg = msg;
        result.data = null;
        return result;
    }
}

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<User> login(
            @RequestParam String username,
            @RequestParam String password
    ) {
        try {
            User user = userService.login(username, password);
            if (user != null) {
                return Result.success(user);
            }
            return Result.error("用户名或密码错误");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}