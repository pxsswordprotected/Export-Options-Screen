import { useEffect, useRef, useState } from "react";
import {
  X,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PdfPreview.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfPreview({ onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handlePrevPage() {
    setPageNumber((prev) => Math.max(1, prev - 1));
  }

  function handleNextPage() {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
  }

  function handleZoomIn() {
    setScale((prev) => Math.min(2.0, prev + 0.25));
  }

  function handleZoomOut() {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  }

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Calculate transform origin based on preview button position
  useEffect(() => {
    const previewButton = document.querySelector(".preview-button");
    const modal = modalRef.current;

    if (previewButton && modal) {
      const buttonRect = previewButton.getBoundingClientRect();
      const modalRect = modal.getBoundingClientRect();

      // Calculate button center relative to modal
      const originX = buttonRect.left + buttonRect.width / 2 - modalRect.left;
      const originY = buttonRect.top + buttonRect.height / 2 - modalRect.top;

      // Set transform origin
      modal.style.transformOrigin = `${originX}px ${originY}px`;
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.key) {
        case "Escape":
          handleClose();
          break;
        case "ArrowLeft":
          if (pageNumber > 1) {
            handlePrevPage();
          }
          break;
        case "ArrowRight":
          if (numPages && pageNumber < numPages) {
            handleNextPage();
          }
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages]);

  return (
    <div
      className={`pdf-preview-backdrop ${isClosing ? "exiting" : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`pdf-preview-modal ${isClosing ? "exiting" : ""}`}
        ref={modalRef}
      >
        <button
          className="pdf-close-button"
          onClick={handleClose}
          aria-label="Close preview"
        >
          <X size={20} weight="bold" />
        </button>

        <div className="pdf-viewer">
          <Document
            file="/The Nature and Art of Workmanship - David Pye.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="pdf-loading">Loading PDF...</div>}
            error={<div className="pdf-error">Failed to load PDF</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        <div className="pdf-controls">
          <div className="pdf-controls-left">
            <button
              onClick={handlePrevPage}
              disabled={pageNumber <= 1}
              aria-label="Previous page"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <span className="page-indicator">
              Page {pageNumber} of {numPages || "—"}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!numPages || pageNumber >= numPages}
              aria-label="Next page"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>

          <div className="pdf-controls-right">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              aria-label="Zoom out"
            >
              <MagnifyingGlassMinus size={16} weight="bold" />
            </button>
            <span className="zoom-indicator">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 2.0}
              aria-label="Zoom in"
            >
              <MagnifyingGlassPlus size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfPreview;
