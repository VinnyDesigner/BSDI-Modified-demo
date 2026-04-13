interface RoleIcon3DProps {
  role: string;
  size?: number;
}

export function RoleIcon3D({ role, size = 48 }: RoleIcon3DProps) {
  const getRoleIcon = () => {
    switch (role) {
      case "BSDI Super Admin":
        return (
          <div 
            className="relative flex items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(237,28,36,0.4)] transform transition-transform hover:scale-105"
            style={{ width: size, height: size }}
          >
            {/* 3D Crown Icon for Super Admin */}
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="superAdminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF4444" />
                  <stop offset="50%" stopColor="#ED1C24" />
                  <stop offset="100%" stopColor="#B01419" />
                </linearGradient>
                <filter id="superAdminShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                  <feOffset dx="0" dy="4" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background Circle */}
              <circle cx="32" cy="32" r="30" fill="url(#superAdminGrad)" opacity="0.95"/>
              
              {/* 3D Highlight */}
              <circle cx="32" cy="28" r="24" fill="white" opacity="0.15"/>
              
              {/* Crown Icon */}
              <g filter="url(#superAdminShadow)">
                {/* Crown Base */}
                <path d="M 18 38 L 46 38 L 44 44 L 20 44 Z" fill="#FFD700" opacity="0.9"/>
                <path d="M 16 38 L 48 38 L 48 40 L 16 40 Z" fill="#FFC700" opacity="0.95"/>
                
                {/* Crown Points */}
                <path d="M 20 38 L 22 28 L 24 38 Z" fill="#FFD700"/>
                <path d="M 28 38 L 32 24 L 36 38 Z" fill="#FFE44D"/>
                <path d="M 40 38 L 42 28 L 44 38 Z" fill="#FFD700"/>
                
                {/* Jewels */}
                <circle cx="32" cy="26" r="2.5" fill="#FF1C68" opacity="0.9"/>
                <circle cx="22" cy="30" r="1.5" fill="#4A90FF" opacity="0.85"/>
                <circle cx="42" cy="30" r="1.5" fill="#4A90FF" opacity="0.85"/>
              </g>
              
              {/* Shine Effect */}
              <circle cx="24" cy="24" r="4" fill="white" opacity="0.3"/>
            </svg>
          </div>
        );

      case "Entity Admin":
        return (
          <div 
            className="relative flex items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(0,63,114,0.4)] transform transition-transform hover:scale-105"
            style={{ width: size, height: size }}
          >
            {/* 3D Shield Icon for Entity Admin */}
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="entityAdminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="50%" stopColor="#003F72" />
                  <stop offset="100%" stopColor="#002952" />
                </linearGradient>
              </defs>
              
              {/* Background Circle */}
              <circle cx="32" cy="32" r="30" fill="url(#entityAdminGrad)" opacity="0.95"/>
              
              {/* 3D Highlight */}
              <circle cx="32" cy="28" r="24" fill="white" opacity="0.15"/>
              
              {/* Shield Icon */}
              <g>
                {/* Shield Shadow */}
                <path d="M 32 20 C 28 20 22 22 20 23 L 20 34 C 20 40 26 46 32 48 C 38 46 44 40 44 34 L 44 23 C 42 22 36 20 32 20 Z" fill="black" opacity="0.2" transform="translate(1, 2)"/>
                
                {/* Shield Main */}
                <path d="M 32 20 C 28 20 22 22 20 23 L 20 34 C 20 40 26 46 32 48 C 38 46 44 40 44 34 L 44 23 C 42 22 36 20 32 20 Z" fill="#5B9FFF" opacity="0.95"/>
                
                {/* Shield Highlight */}
                <path d="M 32 20 C 28 20 22 22 20 23 L 20 34 C 20 38 23 42 27 44.5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
                
                {/* Checkmark */}
                <path d="M 26 32 L 30 36 L 38 28" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
              </g>
              
              {/* Shine Effect */}
              <circle cx="24" cy="24" r="4" fill="white" opacity="0.25"/>
            </svg>
          </div>
        );

      case "Department Reviewer":
        return (
          <div 
            className="relative flex items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(102,102,102,0.4)] transform transition-transform hover:scale-105"
            style={{ width: size, height: size }}
          >
            {/* 3D Clipboard Check Icon for Department Reviewer */}
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="deptReviewerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9CA3AF" />
                  <stop offset="50%" stopColor="#666666" />
                  <stop offset="100%" stopColor="#4B5563" />
                </linearGradient>
              </defs>
              
              {/* Background Circle */}
              <circle cx="32" cy="32" r="30" fill="url(#deptReviewerGrad)" opacity="0.95"/>
              
              {/* 3D Highlight */}
              <circle cx="32" cy="28" r="24" fill="white" opacity="0.15"/>
              
              {/* Clipboard Icon */}
              <g>
                {/* Clipboard Shadow */}
                <rect x="23" y="22" width="18" height="24" rx="2" fill="black" opacity="0.2" transform="translate(1, 2)"/>
                
                {/* Clipboard Main */}
                <rect x="22" y="20" width="20" height="26" rx="2" fill="#E5E7EB" opacity="0.95"/>
                
                {/* Clipboard Clip */}
                <rect x="28" y="18" width="8" height="4" rx="1.5" fill="#9CA3AF"/>
                
                {/* Lines */}
                <line x1="26" y1="28" x2="38" y2="28" stroke="#6B7280" strokeWidth="1.5" opacity="0.7"/>
                <line x1="26" y1="32" x2="38" y2="32" stroke="#6B7280" strokeWidth="1.5" opacity="0.7"/>
                <line x1="26" y1="36" x2="34" y2="36" stroke="#6B7280" strokeWidth="1.5" opacity="0.7"/>
                
                {/* Checkmark */}
                <circle cx="38" cy="38" r="5" fill="#10B981" opacity="0.95"/>
                <path d="M 35.5 38 L 37.5 40 L 40.5 36" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              
              {/* Shine Effect */}
              <circle cx="24" cy="24" r="4" fill="white" opacity="0.2"/>
            </svg>
          </div>
        );

      case "Internal Monitoring":
        return (
          <div 
            className="relative flex items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(176,170,162,0.4)] transform transition-transform hover:scale-105"
            style={{ width: size, height: size }}
          >
            {/* 3D Eye/Monitor Icon for Internal Monitoring */}
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="monitoringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4CDC4" />
                  <stop offset="50%" stopColor="#B0AAA2" />
                  <stop offset="100%" stopColor="#8C8680" />
                </linearGradient>
              </defs>
              
              {/* Background Circle */}
              <circle cx="32" cy="32" r="30" fill="url(#monitoringGrad)" opacity="0.95"/>
              
              {/* 3D Highlight */}
              <circle cx="32" cy="28" r="24" fill="white" opacity="0.15"/>
              
              {/* Monitor/Eye Icon */}
              <g>
                {/* Eye Shadow */}
                <ellipse cx="33" cy="34" rx="16" ry="8" fill="black" opacity="0.2"/>
                
                {/* Eye Outline */}
                <ellipse cx="32" cy="32" rx="16" ry="8" fill="white" opacity="0.9"/>
                
                {/* Iris */}
                <circle cx="32" cy="32" r="6" fill="#3B82F6" opacity="0.95"/>
                
                {/* Pupil */}
                <circle cx="32" cy="32" r="3" fill="#1E40AF" opacity="0.95"/>
                
                {/* Highlight */}
                <circle cx="30" cy="30" r="2" fill="white" opacity="0.9"/>
                
                {/* Scan Lines */}
                <line x1="18" y1="32" x2="46" y2="32" stroke="#ED1C24" strokeWidth="1" opacity="0.6" strokeDasharray="2,2"/>
              </g>
              
              {/* Shine Effect */}
              <circle cx="24" cy="24" r="4" fill="white" opacity="0.2"/>
            </svg>
          </div>
        );

      case "Organization User":
      default:
        return (
          <div 
            className="relative flex items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(37,38,40,0.4)] transform transition-transform hover:scale-105"
            style={{ width: size, height: size }}
          >
            {/* 3D User Icon for Organization User */}
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="orgUserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4B5563" />
                  <stop offset="50%" stopColor="#252628" />
                  <stop offset="100%" stopColor="#111827" />
                </linearGradient>
              </defs>
              
              {/* Background Circle */}
              <circle cx="32" cy="32" r="30" fill="url(#orgUserGrad)" opacity="0.95"/>
              
              {/* 3D Highlight */}
              <circle cx="32" cy="28" r="24" fill="white" opacity="0.15"/>
              
              {/* User Icon */}
              <g>
                {/* Head Shadow */}
                <circle cx="33" cy="28" r="7" fill="black" opacity="0.2"/>
                
                {/* Head */}
                <circle cx="32" cy="27" r="7" fill="#94A3B8" opacity="0.95"/>
                
                {/* Head Highlight */}
                <circle cx="30" cy="25" r="3" fill="white" opacity="0.25"/>
                
                {/* Body Shadow */}
                <path d="M 20 46 Q 20 36 32 36 Q 44 36 44 46 Z" fill="black" opacity="0.2" transform="translate(1, 1)"/>
                
                {/* Body */}
                <path d="M 20 46 Q 20 36 32 36 Q 44 36 44 46 Z" fill="#94A3B8" opacity="0.95"/>
                
                {/* Body Highlight */}
                <path d="M 22 46 Q 22 38 32 38 Q 42 38 42 46 Z" fill="white" opacity="0.15"/>
              </g>
              
              {/* Shine Effect */}
              <circle cx="24" cy="24" r="4" fill="white" opacity="0.2"/>
            </svg>
          </div>
        );
    }
  };

  return getRoleIcon();
}
