import React from "react";
const ErrorTable = ({ error, semiVarioGram, variable }) => {
  const isHaveNuggetSillRange = Object.keys(variable).length > 0;
  const isHaveCalculateConstant = isHaveNuggetSillRange
    ? true
    : semiVarioGram && semiVarioGram.exponentialWithConstant;

  return (
    <div>
      <table id="error-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Mean Error</th>
            <th>Mean of Percentage Error</th>
            <th>Mean Absolute Error</th>
            <th>Mean Squre Error</th>
            <th>Root Mean Squre Error</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          <tr>
            <td>Exponential</td>
            <td>{error["exponential"].meanError}</td>
            <td>{error["exponential"].meanOfPercentageError}</td>
            <td>{error["exponential"].meanAbsoluteError}</td>
            <td>{error["exponential"].meanSquareError}</td>
            <td>{error["exponential"].rootMeanSquareError}</td>
          </tr>
          <tr>
            <td>Linear</td>
            <td>{error["linear"].meanError}</td>
            <td>{error["linear"].meanOfPercentageError}</td>
            <td>{error["linear"].meanAbsoluteError}</td>
            <td>{error["linear"].meanSquareError}</td>
            <td>{error["linear"].rootMeanSquareError}</td>
          </tr>
          <tr>
            <td>Spherical</td>
            <td>{error["sherical"].meanError}</td>
            <td>{error["sherical"].meanOfPercentageError}</td>
            <td>{error["sherical"].meanAbsoluteError}</td>
            <td>{error["sherical"].meanSquareError}</td>
            <td>{error["sherical"].rootMeanSquareError}</td>
          </tr>
          <tr>
            <td>Pentaspherical</td>
            <td>{error["pentaspherical"].meanError}</td>
            <td>{error["pentaspherical"].meanOfPercentageError}</td>
            <td>{error["pentaspherical"].meanAbsoluteError}</td>
            <td>{error["pentaspherical"].meanSquareError}</td>
            <td>{error["pentaspherical"].rootMeanSquareError}</td>
          </tr>
          <tr>
            <td>Guassian</td>
            <td>{error["gaussian"].meanError}</td>
            <td>{error["gaussian"].meanOfPercentageError}</td>
            <td>{error["gaussian"].meanAbsoluteError}</td>
            <td>{error["gaussian"].meanSquareError}</td>
            <td>{error["gaussian"].rootMeanSquareError}</td>
          </tr>
          {/* trendline */}
          <tr>
            <td>Exponential Polynomial Trendline</td>
            <td>{error["exponential"].meanError}</td>
            <td>{error["exponential"].meanOfPercentageError}</td>
            <td>{error["exponential"].meanAbsoluteError}</td>
            <td>{error["exponential"].meanSquareError}</td>
            <td>{error["exponential"].rootMeanSquareError}</td>
          </tr>
          <tr>
            <td>Exponential with K iteration</td>
            <td>{error["exponentialWithKIteration"].meanError}</td>
            <td>{error["exponentialWithKIteration"].meanOfPercentageError}</td>
            <td>{error["exponentialWithKIteration"].meanAbsoluteError}</td>
            <td>{error["exponentialWithKIteration"].meanSquareError}</td>
            <td>{error["exponentialWithKIteration"].rootMeanSquareError}</td>
          </tr>
          {isHaveCalculateConstant && (
            <tr>
              <td>Exponential with Constant</td>
              <td>{error["exponentialWithConstant"].meanError}</td>
              <td>{error["exponentialWithConstant"].meanOfPercentageError}</td>
              <td>{error["exponentialWithConstant"].meanAbsoluteError}</td>
              <td>{error["exponentialWithConstant"].meanSquareError}</td>
              <td>{error["exponentialWithConstant"].rootMeanSquareError}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ErrorTable;
