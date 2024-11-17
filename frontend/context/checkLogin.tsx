import axios from "axios";
import { User } from "./userContext";
import React, { useState, useEffect, useRef } from 'react';

export const checkLoggedIn = async () => {
    try {
        const res = await axios.get('/users/');
        const user: User = {
            isLoggedIn: true,
            username: res.data.data.username,
            quota: {
                image: res.data.data.image_quota,
                video: res.data.data.video_quota,
            }
        }
        return user;
    } catch (error) {
        return false;
    }

};