import React from 'react';
import classNames from 'classnames';
import ButtonProgress from 'components/ButtonProgress';

import './index.css';

interface Props {
  className?: string;
  onClick?: () => unknown;
  fullWidth?: boolean;
  size?: 'large' | 'normal' | 'small' | 'mini';
  color?: 'primary' | 'gray' | 'red' | 'orange' | 'white';
  disabled?: boolean;
  children?: React.ReactNode;
  outline?: boolean;
  isDoing?: boolean;
  isDone?: boolean;
  progressSize?: number;
}

export default (props: Props) => {
  const {
    className,
    onClick,
    fullWidth = false,
    size = 'normal',
    color = 'primary',
    disabled,
    outline = false,
    isDoing = false,
    isDone = false,
  } = props;

  return (
    <button
      className={classNames(
        'button',
        className,
        {
          'w-full': fullWidth,
          [size]: size,
          'bg-black text-white dark:bg-white dark:text-black': !outline && color === 'primary',
          'bg-white text-black': !outline && color === 'white',
          'bg-gray-bd text-white dark:bg-[#333] dark:opacity-60': !outline && color === 'gray',
          'bg-orange-400 text-black': !outline && color === 'orange',
          'bg-red-500 text-white': !outline && color === 'red',
          'border-black text-black dark:border-white dark:text-white dark:text-opacity-80 border outline': outline && color === 'primary',
          'border-red-500 text-red-500 border outline': outline && color === 'red',
          'border-orange-400 text-orange-400 border outline': outline && color === 'orange',
          'border-white text-white border outline': outline && color === 'white',
          'border-gray-af text-gray-af border outline': outline && color === 'gray',
        },
        'rounded-full outline-none leading-none',
      )}
      onClick={() => {
        onClick && onClick();
      }}
      disabled={disabled}
    >
      <div className="flex justify-center items-center">
        {props.children}
        <ButtonProgress
          isDoing={isDoing}
          isDone={isDone}
          color='inherit'
        />
      </div>
    </button>
  );
};