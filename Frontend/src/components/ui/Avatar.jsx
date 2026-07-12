import React from 'react';

const Avatar = ({ src, alt = 'User Avatar', name = '', size = 'md', className = '' }) => {
  const getAvatarDimensions = () => {
    switch (size) {
      case 'sm': return 'w-7 h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] text-[10px]';
      case 'lg': return 'w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] text-sm';
      case 'xl': return 'w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] text-base';
      case 'md':
      default: return 'w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] text-xs';
    }
  };

  const extractInitials = () => {
    if (!name) return '??';
    const splitName = name.trim().split(' ');
    if (splitName.length > 1) {
      return (splitName[0][0] + splitName[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const baseContainerStyles = `relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ${getAvatarDimensions()} ${className}`;

  if (src) {
    return (
      <div className={baseContainerStyles}>
        <img src={src} alt={alt || name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${baseContainerStyles} bg-profile-bg text-profile-text`}>
      <span className="font-semibold tracking-wide">{extractInitials()}</span>
    </div>
  );
};

export default Avatar;
