#!/bin/bash
cd ../backend_v2
nohup npm start >> out.log 2>&1 & echo $! > pid
echo "Backend Server Started!"