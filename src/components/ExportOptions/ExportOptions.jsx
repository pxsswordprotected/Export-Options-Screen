import { useState } from "react";
import { CaretLeft, File } from "@phosphor-icons/react";
import Dropdown from "./Dropdown";
import InlineCode from "./InlineCode";
import PdfPreview from "../PdfPreview/PdfPreview";
import AnimatedEye from "./AnimatedEye";
import "./ExportOptions.css";

const formatOptions = [
  { value: "pdf", label: "Pdf" },
  { value: "png", label: "Png" },
  { value: "jpg", label: "Jpg" },
  { value: "svg", label: "Svg" },
  { value: "webp", label: "WebP" },
];

const resolutionOptions = [
  { value: "high", label: "High (300 DPI)" },
  { value: "medium", label: "Medium (150 DPI)" },
  { value: "low", label: "Low (72 DPI)" },
];

const compressionOptions = [
  { value: "lossless", label: "Lossless" },
  { value: "lossy", label: "Lossy" },
  { value: "none", label: "None" },
];

function ExportOptions() {
  const [fileFormat, setFileFormat] = useState("pdf");
  const [resolution, setResolution] = useState("high");
  const [compression, setCompression] = useState("lossless");
  const [showPreview, setShowPreview] = useState(false);

  function handlePreviewClick() {
    if (fileFormat === 'pdf') {
      setShowPreview(true);
    }
  }

  return (
    <div className="export-options">
      <header className="export-options-header">
        <button type="button" className="header-back" aria-label="Go back">
          <CaretLeft size={18} weight="bold" />
        </button>
        <span className="header-title">Export Options</span>
      </header>

      <div className="export-options-content">
        <div className="setting-row">
          <div className="setting-row-left">
            <span className="setting-label">File Format</span>
            <span className="setting-description">
              Choose the output file type.
            </span>
          </div>
          <Dropdown
            options={formatOptions}
            value={fileFormat}
            onChange={setFileFormat}
            label="File format"
            width="90px"
          />
        </div>

        <div className="setting-row">
          <div className="setting-row-left">
            <span className="setting-label">Resolution</span>
            <span className="setting-description">
              Set the quality of the export.
            </span>
          </div>
          <Dropdown
            options={resolutionOptions}
            value={resolution}
            onChange={setResolution}
            label="Resolution"
            width="164px"
          />
        </div>

        <div className="setting-row">
          <div className="setting-row-left">
            <span className="setting-label">Compression</span>
            <span className="setting-description">
              Adjust file size optimization.
            </span>
          </div>
          <Dropdown
            options={compressionOptions}
            value={compression}
            onChange={setCompression}
            label="Compression"
            width="110px"
          />
        </div>

        <div className="setting-row">
          <div className="setting-row-left">
            <span className="setting-label">Generate Preview</span>
            <span className="setting-description">
              Create a temporary snapshot to view.
            </span>
          </div>
          <button
            type="button"
            className="preview-button"
            aria-label="Generate preview"
            onClick={handlePreviewClick}
            disabled={fileFormat !== 'pdf'}
          >
            <span className="preview-button-icon">
              <AnimatedEye size={16} />
            </span>
            <span>Preview</span>
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-row-left">
            <span className="setting-label">CLI Export</span>
            <span className="setting-description">
              To run this headless, add the flag{" "}
              <InlineCode>--headless</InlineCode> to your build script.
            </span>
          </div>
        </div>
      </div>

      {showPreview && (
        <PdfPreview onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

export default ExportOptions;
