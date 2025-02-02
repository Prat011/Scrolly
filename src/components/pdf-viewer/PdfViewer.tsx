"use client";

import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { ContextPanel } from './ContextPanel';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { RainbowButton } from '../ui/rainbow-button';
import { StarBorder } from '../ui/star-border';
import '../../styles/globals.css';
import { Analytics } from '@vercel/analytics/react'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export function PdfViewer() {
  const [selectedText, setSelectedText] = useState('');
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const plugins = [
    defaultLayoutPluginInstance,
    zoomPluginInstance,
    pageNavigationPluginInstance,
  ];

  const handleTextSelection = (e: any) => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text) {
        setSelectedText(text);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfFile(url);
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Navigation />
        
        <div 
          className="flex-1 bg-black p-4 overflow-hidden"
          onMouseUp={handleTextSelection}
        >
          <div className="h-full bg-black rounded-lg shadow-lg overflow-hidden">
            {!pdfFile ? (
              <div className="h-full flex items-center justify-center bg-black">
                <RainbowButton className="animate-rainbow-border">
                  <label className="cursor-pointer text-white">
                    Upload PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </RainbowButton>
              </div>
            ) : (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="h-full overflow-auto [&_.rpv-core__viewer]:bg-black [&_.rpv-core__inner-pages]:bg-black [&_.rpv-core__textbox]:bg-black [&_.rpv-core__textbox]:text-white">
                  <Viewer
                    fileUrl={pdfFile}
                    plugins={plugins}
                    defaultScale={SpecialZoomLevel.PageFit}
                    theme="dark"
                  />
                </div>
              </Worker>
            )}
          </div>
        </div>

        <ContextPanel selectedText={selectedText} />
      </div>
      <Analytics />
    </>
  );
}