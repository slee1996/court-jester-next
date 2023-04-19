import React, { MouseEventHandler } from "react";

interface SubmitButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => (
  <button
    type='submit'
    name='Submit'
    className='text-white border border-white w-1/2 my-4 rounded-sm hover:bg-white hover:text-black'
    onClick={onClick}
  >
    submit
  </button>
);
