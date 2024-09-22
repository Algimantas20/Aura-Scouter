import { createCanvas, loadImage } from "canvas";
import fetch from 'node-fetch';

async function fetchAvatarImage(avatarUrl) {
    const response = await fetch(avatarUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch avatar image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType.startsWith('image/')) {
        throw new Error('Fetched resource is not an image');
    }

    const arrayBuffer = await response.arrayBuffer();
    return loadImage(Buffer.from(arrayBuffer));
}

function drawBackground(ctx, width, height) {
    ctx.fillStyle = "#59515E";
    ctx.fillRect(0, 0, width, height);
    
    ctx.lineWidth = 0;
    ctx.fillStyle = "Black"; 
    ctx.beginPath(); 
    ctx.moveTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(width - 100, height);
    ctx.arcTo(width - 100, height - 130, width - 200, 0, 180);
    ctx.lineTo(width - 200, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawAvatar(ctx, avatarImage, x, y, radius) {
    ctx.save();
    ctx.lineWidth = 5;
    
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(avatarImage, x - radius, y - radius, radius * 2, radius * 2); 
    ctx.restore();
}

function drawProgressBar(ctx, currentAura, maxAura, height) {
    const fillWidth = (currentAura / maxAura) * 400;
    ctx.fillStyle = "#DC143C";
    ctx.beginPath();
    ctx.moveTo(50, height - 30);
    ctx.arc(50, height - 45, 15, Math.PI / 2, Math.PI * 1.5);
    ctx.lineTo(50 + fillWidth, height - 60);
    ctx.arc(50 + fillWidth, height - 45, 15, Math.PI * 1.5, Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(50, height - 30);
    ctx.arc(50, height - 45, 15, Math.PI / 2, Math.PI * 1.5);
    ctx.lineTo(475, height - 60);
    ctx.arc(475, height - 45, 15, Math.PI * 1.5, Math.PI / 2);
    ctx.closePath();
    ctx.stroke();
}

function drawText(ctx, user, currentAura, maxAura, level, height) {
    const username = user.username; 
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(username, 175, height - 140);

    const textWidth = ctx.measureText(username).width; 
    ctx.beginPath();
    ctx.moveTo(175, 65);

    if(textWidth>210){
        textWidth = textWidth-210
        ctx.lineTo(210 + textWidth, height - 135);
    } else{
        ctx.lineTo(210 + textWidth, height - 135);
    }
 
    ctx.stroke();

    ctx.font = "18px Arial";
    ctx.fillText(`Aura: ${currentAura} / ${maxAura} Level:${level}`, 175, height - 110); 
}

export async function createProgressBar(currentAura, maxAura, user, level) {
    const width = 650;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    try {
        drawBackground(ctx, width, height);

        const avatarUrl = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }).replace('.webp', '.png');
        const avatarImage = await fetchAvatarImage(avatarUrl);
        
        drawAvatar(ctx, avatarImage, 100, 65, 50);
        drawProgressBar(ctx, currentAura, maxAura, height);
        drawText(ctx, user, currentAura, maxAura, level, height);

        return canvas.toBuffer();
    } catch (err) {
        console.error('Failed to load image:', err);
        return null;
    }
}