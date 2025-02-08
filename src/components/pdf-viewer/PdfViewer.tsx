"use client";

import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';

export function PdfViewer() {
  const [selectedText, setSelectedText] = useState('');
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const router = useRouter();



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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const url = URL.createObjectURL(file);
        setPdfFile(url);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    if (isMounted) {
      // Clear authentication tokens or session data here
      // For example: localStorage.removeItem('authToken');

      // Redirect to login page using the App Router
      router.push('/login');
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
                  <label className="cursor-pointer text-white font-['Instrument_Serif'] relative">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading PDF...</span>
                      </div>
                    ) : (
                      <>
                        Upload PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </>
                    )}
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