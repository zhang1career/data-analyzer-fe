import * as React from "react";
import {FC, ReactElement, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {MyAssembleProps} from "@/hocs/defines/MyAssembleProps.ts";
import {ComponentProps} from "@/defines/combines/ComponentProps.ts";


interface StepperProps extends ComponentProps {
  finishText?: string;
  isResetable?: boolean;
  children: ReactElement<MyAssembleProps>[];
}

const MyStepper: FC<StepperProps> = ({
                                       finishText = 'All steps completed - you\'re finished',
                                       isResetable = false,
                                       children,
                                       ...rest
                                     }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [canProceed, setCanProceed] = useState<boolean>(true);

  useEffect(() => {
    // Check if the current step's child component has the isNextEnabled prop set to true
    const currentChild = children[activeStep];
    if (!currentChild) {
      return;
    }
    if (currentChild.props.isNextEnabled === undefined) {
      setCanProceed(true);
      return;
    }
    setCanProceed(currentChild.props.isNextEnabled);
  }, [activeStep, children]);

  const handleNext = () => {
    if (canProceed) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        {...rest}
      >
        {children.map((child, index) => (
          <Step key={child.props.title ? child.props.title : index}>
            <StepLabel
              optional={
                index === children.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {child.props.title}
            </StepLabel>

            <StepContent>
              {child.props.description && <Typography>{child.props.description}</Typography>}
              <div>
                {child}
              </div>
              <Box sx={{mb: 2}}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!canProceed}
                  sx={{mt: 1, mr: 1}}
                >
                  {index === children.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{mt: 1, mr: 1}}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === children.length && (
        <Paper square elevation={0} sx={{p: 3}}>
          <Typography>{finishText}</Typography>
          {isResetable && (
            <Button onClick={handleReset} sx={{mt: 1, mr: 1}}>
              Reset
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default MyStepper;