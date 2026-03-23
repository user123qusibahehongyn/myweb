package com.example.petadopt.service;

import com.example.petadopt.entity.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public User login(String username, String password) {
        // 先写空实现（后续对接Mapper），仅保证编译通过
        return null;
    }

    public User getUserById(Integer id) {
        // 先写空实现（后续对接Mapper），仅保证编译通过
        return null;
    }
}