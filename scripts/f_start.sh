#!/bin/bash
cd ../frontend
nohup npm start >> out.log 2>&1 & echo $! > pid
echo "Frontend Started!"