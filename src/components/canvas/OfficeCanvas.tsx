'use client';

import React, { useRef, useEffect } from 'react';
import { AgentItem, WorkspaceItem } from '@/lib/types';
import { useOfficeStore } from '@/lib/store/useOfficeStore';

interface OfficeCanvasProps {
  workspaces: WorkspaceItem[];
  agents: AgentItem[];
}

export const OfficeCanvas: React.FC<OfficeCanvasProps> = ({ workspaces, agents }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { zoom, selectedAgentId, setSelectedAgentId, openTaskModal } = useOfficeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable crisp pixel-art retro rendering
    ctx.imageSmoothingEnabled = false;

    let animationFrameId: number;
    let catX = 480;
    let catDir = 1;
    let tick = 0;

    const render = () => {
      tick++;
      // Animate roaming cat on checkered floor
      catX += 0.4 * catDir;
      if (catX > 580) catDir = -1;
      if (catX < 460) catDir = 1;

      // Clear Canvas Background (Dark Navy Void)
      ctx.save();
      ctx.fillStyle = '#0f0f1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply Zoom & Center transform
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-450, -320); // Center the 900x640 office layout

      // ==========================================
      // 1. RENDER ROOM FLOORS & WALLS
      // ==========================================

      // External Office Walls (Dark Indigo Outline)
      ctx.fillStyle = '#1c1c2e';
      ctx.fillRect(70, 30, 760, 580);
      ctx.strokeStyle = '#2d2d48';
      ctx.lineWidth = 6;
      ctx.strokeRect(70, 30, 760, 580);

      // --- ROOM 1: TOP-LEFT (Brick Floor - Payments) ---
      ctx.fillStyle = '#8a3c30'; // Red Brick
      ctx.fillRect(80, 40, 360, 260);
      // Brick grid pattern
      ctx.strokeStyle = '#702d24';
      ctx.lineWidth = 1;
      for (let y = 40; y < 300; y += 16) {
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(440, y);
        ctx.stroke();
      }

      // --- ROOM 2: TOP-RIGHT (Green Carpet - Storefront) ---
      ctx.fillStyle = '#2f694e'; // Green
      ctx.fillRect(460, 40, 360, 260);
      ctx.fillStyle = '#285842';
      for (let x = 460; x < 820; x += 32) {
        for (let y = 40; y < 300; y += 32) {
          ctx.fillRect(x, y, 16, 16);
        }
      }

      // --- ROOM 3: BOTTOM-LEFT (Wood Boardroom / Conference) ---
      ctx.fillStyle = '#3a271b'; // Dark Wood
      ctx.fillRect(80, 320, 360, 280);
      ctx.strokeStyle = '#2b1c13';
      ctx.lineWidth = 2;
      for (let y = 320; y < 600; y += 20) {
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(440, y);
        ctx.stroke();
      }

      // --- ROOM 4: BOTTOM-RIGHT (Lounge & Chill Area) ---
      ctx.fillStyle = '#29435c'; // Slate Blue
      ctx.fillRect(460, 320, 360, 180);

      // --- CHECKERED TILES (Bottom Right Hallway) ---
      for (let x = 460; x < 820; x += 24) {
        for (let y = 500; y < 600; y += 24) {
          ctx.fillStyle = (x + y) % 48 === 0 ? '#d1d5db' : '#1f2937';
          ctx.fillRect(x, y, 24, 24);
        }
      }

      // Center Hallway & Divider Walls
      ctx.fillStyle = '#1c1c2e';
      ctx.fillRect(440, 40, 20, 560); // Vertical Wall
      ctx.fillRect(80, 300, 740, 20);  // Horizontal Wall

      // Doorway Cutouts
      ctx.fillStyle = '#273449';
      ctx.fillRect(440, 140, 20, 40); // Top hallway pass
      ctx.fillRect(440, 440, 20, 40); // Bottom hallway pass
      ctx.fillRect(240, 300, 50, 20); // Conference door

      // ==========================================
      // 2. RENDER FURNITURE & DECORATIONS
      // ==========================================

      // --- Large White Table (Room 1) ---
      ctx.fillStyle = '#dcdde1';
      ctx.fillRect(230, 110, 80, 70);
      ctx.strokeStyle = '#718093';
      ctx.strokeRect(230, 110, 80, 70);
      // PC Monitors on Table
      drawMonitor(ctx, 245, 120);
      drawMonitor(ctx, 285, 120);

      // --- Plus-shaped Desk (Room 2) ---
      ctx.fillStyle = '#b7791f'; // Oak Wood
      ctx.fillRect(600, 120, 70, 70);
      ctx.fillStyle = '#975a16';
      ctx.fillRect(570, 140, 130, 30);
      drawMonitor(ctx, 605, 125);
      drawMonitor(ctx, 655, 145);

      // --- Conference Table & Chairs (Room 3) ---
      ctx.fillStyle = '#c084fc';
      // Table
      ctx.fillStyle = '#a16207';
      ctx.fillRect(200, 390, 80, 120);
      ctx.strokeStyle = '#713f12';
      ctx.strokeRect(200, 390, 80, 120);
      // Monitors on Conference Table
      drawMonitor(ctx, 230, 410);
      drawMonitor(ctx, 230, 460);
      // Chairs
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(175, 410, 15, 20);
      ctx.fillRect(175, 460, 15, 20);
      ctx.fillRect(290, 410, 15, 20);
      ctx.fillRect(290, 460, 15, 20);

      // --- Potted Plants (Room 3 & Hallway) ---
      drawPlant(ctx, 95, 335);
      drawPlant(ctx, 95, 560);
      drawPlant(ctx, 410, 335);
      drawPlant(ctx, 410, 560);
      drawPlant(ctx, 775, 55);

      // --- Red Lounge Sofas (Room 4) ---
      ctx.fillStyle = '#b91c1c'; // Red Couch
      ctx.fillRect(570, 360, 80, 20); // Top couch
      ctx.fillRect(570, 440, 80, 20); // Bottom couch
      ctx.fillRect(540, 375, 20, 70); // Left couch
      ctx.fillRect(660, 375, 20, 70); // Right couch
      // Coffee Table in middle
      ctx.fillStyle = '#78350f';
      ctx.fillRect(580, 395, 60, 30);
      ctx.fillStyle = '#fef08a'; // Mug
      ctx.fillRect(605, 405, 6, 8);

      // --- Roaming Black Cat ---
      ctx.fillStyle = '#18181b';
      ctx.fillRect(catX, 545, 14, 8); // Body
      ctx.fillRect(catDir > 0 ? catX + 10 : catX - 4, 541, 6, 6); // Head
      // Ears
      ctx.fillRect(catDir > 0 ? catX + 11 : catX - 3, 539, 2, 2);
      ctx.fillRect(catDir > 0 ? catX + 14 : catX, 539, 2, 2);
      // Tail
      ctx.fillRect(catDir > 0 ? catX - 3 : catX + 14, 543, 4, 2);

      // ==========================================
      // 3. RENDER AGENTS & AVATARS
      // ==========================================
      agents.forEach((agent) => {
        const isSelected = selectedAgentId === agent.id;
        drawAgent(ctx, agent, isSelected, tick);
      });

      // ==========================================
      // 4. RENDER SPEECH BUBBLES
      // ==========================================
      agents.forEach((agent) => {
        if (agent.currentAction && agent.currentAction !== 'Idle') {
          drawSpeechBubble(ctx, agent.currentX, agent.currentY, agent.currentAction, agent.workspaceName);
        } else if (agent.status === 'IDLE') {
          drawSpeechBubble(ctx, agent.currentX, agent.currentY, 'Idle', agent.workspaceName || 'Infra');
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Click handler on canvas to select agents or trigger task modal
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Transform mouse coordinate to canvas coordinate
      const worldX = (mouseX - canvas.width / 2) / zoom + 450;
      const worldY = (mouseY - canvas.height / 2) / zoom + 320;

      // Check if clicked near an agent
      const clicked = agents.find((ag) => {
        const dist = Math.hypot(ag.currentX - worldX, ag.currentY - worldY);
        return dist < 35;
      });

      if (clicked) {
        setSelectedAgentId(clicked.id);
        openTaskModal(clicked.workspaceId);
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleClick);
    };
  }, [workspaces, agents, zoom, selectedAgentId, setSelectedAgentId, openTaskModal]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0d0d15] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={1400}
        height={900}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

// Helper: Draw 8-Bit Retro Computer Monitor
function drawMonitor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y, 16, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 2, y + 2, 12, 8); // Screen glow
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 6, y + 12, 4, 3); // Stand
}

// Helper: Draw Potted Plant
function drawPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#b45309'; // Clay Pot
  ctx.fillRect(x, y + 8, 14, 12);
  ctx.fillStyle = '#15803d'; // Leaves
  ctx.fillRect(x - 2, y, 18, 8);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x + 2, y - 4, 10, 6);
}

// Helper: Draw 8-bit Pixel Character Avatar
function drawAgent(
  ctx: CanvasRenderingContext2D,
  agent: AgentItem,
  isSelected: boolean,
  tick: number
) {
  const x = agent.currentX;
  const y = agent.currentY;

  // Selected ring glow
  if (isSelected) {
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 14, y - 24, 28, 36);
  }

  // Shadow under agent
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Avatar body colors
  const palette: Record<string, { body: string; hair: string }> = {
    dev_orange: { body: '#d97706', hair: '#78350f' },
    dev_green: { body: '#059669', hair: '#b45309' },
    dev_pink: { body: '#db2777', hair: '#fde047' },
    dev_blue: { body: '#2563eb', hair: '#451a03' },
  };
  const colors = palette[agent.avatarSprite] || { body: '#475569', hair: '#000000' };

  // Typing bounce animation when working
  const bounce = agent.status === 'WORKING' && Math.floor(tick / 15) % 2 === 0 ? 1 : 0;

  // Head & Hair
  ctx.fillStyle = colors.hair;
  ctx.fillRect(x - 6, y - 16 - bounce, 12, 6);

  // Face & Eyes
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x - 5, y - 10 - bounce, 10, 6);
  ctx.fillStyle = '#000000';
  ctx.fillRect(x - 3, y - 8 - bounce, 2, 2);
  ctx.fillRect(x + 1, y - 8 - bounce, 2, 2);

  // Body / Shirt
  ctx.fillStyle = colors.body;
  ctx.fillRect(x - 6, y - 4 - bounce, 12, 10);

  // Legs / Chair
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 5, y + 6, 4, 5);
  ctx.fillRect(x + 1, y + 6, 4, 5);
}

// Helper: Draw Retro Pixel Speech Bubble
function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  actionText: string,
  subText?: string
) {
  ctx.save();
  ctx.font = 'bold 9px monospace';

  const title = actionText.length > 32 ? actionText.slice(0, 32) + '...' : actionText;
  const subtitle = subText ? subText : '';

  const width = Math.max(ctx.measureText(title).width, ctx.measureText(subtitle).width) + 20;
  const height = subtitle ? 28 : 18;
  const bubbleX = x - width / 2;
  const bubbleY = y - 48;

  // Bubble Box Background
  ctx.fillStyle = '#1e2238';
  ctx.fillRect(bubbleX, bubbleY, width, height);

  // Bubble Border
  ctx.strokeStyle = '#3b4268';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bubbleX, bubbleY, width, height);

  // Pointer triangle
  ctx.fillStyle = '#1e2238';
  ctx.beginPath();
  ctx.moveTo(x - 4, bubbleY + height);
  ctx.lineTo(x + 4, bubbleY + height);
  ctx.lineTo(x, bubbleY + height + 5);
  ctx.fill();

  // Status Indicator Dot (Left inside bubble)
  ctx.fillStyle = actionText.startsWith('Idle') ? '#38bdf8' : '#4ade80';
  ctx.beginPath();
  ctx.arc(bubbleX + 7, bubbleY + 9, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Action text
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(title, bubbleX + 13, bubbleY + 11);

  // Subtitle / Repo text
  if (subtitle) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px monospace';
    ctx.fillText(subtitle, bubbleX + 13, bubbleY + 22);
  }

  ctx.restore();
}
