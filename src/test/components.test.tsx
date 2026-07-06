import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GlassCard from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";
import AnimatedCounter from "../components/ui/AnimatedCounter";

// Mock AppContext since AnimatedCounter depends on reducedMotion from context
vi.mock("../context/AppContext", () => ({
  useApp: () => ({
    reducedMotion: false
  })
}));

describe("UI Components Suite", () => {
  describe("GlassCard Component", () => {
    it("renders children content correctly", () => {
      render(
        <GlassCard>
          <div data-testid="card-child">Card Content</div>
        </GlassCard>
      );
      expect(screen.getByTestId("card-child")).toBeInTheDocument();
      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });
  });

  describe("Badge Component", () => {
    it("renders text content", () => {
      render(<Badge>Operational</Badge>);
      expect(screen.getByText("Operational")).toBeInTheDocument();
    });

    it("applies the correct styling classes based on variant", () => {
      const { container } = render(<Badge variant="error">High Risk</Badge>);
      expect(container.firstChild).toHaveClass("bg-rose-500/15");
    });
  });

  describe("AnimatedCounter Component", () => {
    it("renders display suffix and prefix values", () => {
      render(<AnimatedCounter value={100} prefix="$" suffix="%" />);
      expect(screen.getByText(/%/)).toBeInTheDocument();
      expect(screen.getByText(/\$/)).toBeInTheDocument();
    });
  });
});
