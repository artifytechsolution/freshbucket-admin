"use client";

import React from 'react';
import Editor from 'react-simple-wysiwyg';
import Label from '@/components/form/Label';

const HotelDescriptionEditor = ({ value, onChange, placeholder, label, error }) => {
  const handleEditorChange = (e) => {
    onChange(e.target.value);
  };

  // Clean HTML for character count (remove tags)
  const getTextLength = (htmlString) => {
    if (!htmlString) return 0;
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return (div.textContent || div.innerText || '').length;
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Editor Container */}
      <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
        <Editor
          value={value || ''}
          onChange={handleEditorChange}
          placeholder={placeholder}
          containerProps={{
            style: {
              minHeight: '200px',
              maxHeight: '500px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }
          }}
        />
      </div>
      
      {/* Footer with character count and error */}
      <div className="flex justify-between items-center text-xs">
        <div className="text-gray-500">
          {value ? `${getTextLength(value)} characters` : '0 characters'}
        </div>
        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </div>
      
      {/* Help text */}
      <div className="text-xs text-gray-400">
        Use the toolbar above to format your hotel description with <strong>bold</strong>, <em>italic</em>, lists, and more.
      </div>
    </div>
  );
};

export default HotelDescriptionEditor;
