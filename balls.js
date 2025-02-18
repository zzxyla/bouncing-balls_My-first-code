class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 4; // x方向速度
        this.dy = (Math.random() - 0.5) * 4; // y方向速度
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(canvas) {
        // 碰到左右边界时反弹
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        // 碰到上下边界时反弹
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // 检测与其他小球的碰撞
        balls.forEach(otherBall => {
            if (this === otherBall) return; // 跳过自身

            const dx = otherBall.x - this.x;
            const dy = otherBall.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 如果两球距离小于它们的半径之和，说明发生碰撞
            if (distance < this.radius + otherBall.radius) {
                // 计算碰撞角度
                const angle = Math.atan2(dy, dx);
                
                // 计算两球中心在碰撞方向上的速度分量
                const thisSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
                const otherSpeed = Math.sqrt(otherBall.dx * otherBall.dx + otherBall.dy * otherBall.dy);
                
                // 交换速度方向
                const thisDirection = Math.atan2(this.dy, this.dx);
                const otherDirection = Math.atan2(otherBall.dy, otherBall.dx);
                
                // 更新速度
                this.dx = otherSpeed * Math.cos(otherDirection);
                this.dy = otherSpeed * Math.sin(otherDirection);
                otherBall.dx = thisSpeed * Math.cos(thisDirection);
                otherBall.dy = thisSpeed * Math.sin(thisDirection);
                
                // 防止小球重叠
                const overlap = (this.radius + otherBall.radius - distance) / 2;
                const moveX = overlap * Math.cos(angle);
                const moveY = overlap * Math.sin(angle);
                
                this.x -= moveX;
                this.y -= moveY;
                otherBall.x += moveX;
                otherBall.y += moveY;
            }
        });

        this.x += this.dx;
        this.y += this.dy;
    }
}

// 初始化画布
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 创建小球数组
const balls = [];
const colors = ['#FF0000', '#0000FF', '#00FF00']; // 红、蓝、绿
const ballCount = 19; // 改为19个小球：5红、5蓝、9绿

// 生成小球
for (let i = 0; i < ballCount; i++) {
    const radius = 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = i < 5 ? colors[0] : (i < 10 ? colors[1] : colors[2]); // 前5个红色，接着5个蓝色，剩下的都是绿色
    balls.push(new Ball(x, y, radius, color));
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.update(canvas);
        ball.draw(ctx);
    });

    requestAnimationFrame(animate);
}

animate(); 