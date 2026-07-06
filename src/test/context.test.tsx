import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppProvider, useApp } from "../context/AppContext";

const TestConsumer = () => {
  const { userRole, stadiumHealth, activeStadium } = useApp();
  return (
    <div>
      <span data-testid="role">{userRole}</span>
      <span data-testid="health">{stadiumHealth}</span>
      <span data-testid="stadium">{activeStadium}</span>
    </div>
  );
};

describe("Global AppContext Provider", () => {
  it("provides default state parameters to children consumers", () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    expect(screen.getByTestId("role")).toHaveTextContent("fan");
    expect(screen.getByTestId("health")).toHaveTextContent("98");
    expect(screen.getByTestId("stadium")).toHaveTextContent("SoFi Stadium, LA");
  });
});
