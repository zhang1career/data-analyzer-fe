import React, {useContext} from "react";
import {analysis} from "@/io/WritingIO.ts";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {WritingAnalysisDto} from "@/pojo/dto/WritingAnalysisDto.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import Typography from "@mui/material/Typography";
import {SteppableProps} from "@/defines/combines/SteppableProps.ts";
import {ResultROProps} from "@/defines/abilities/ResultROProps.ts";
import {ResultWOPropsBeta} from "@/defines/abilities/ResultWOPropsBeta.ts";
import {StyledMuiIconButton} from "@/components/styled/buttons/StyledMuiIconButton.tsx";
import {Search} from "@mui/icons-material";
import MuiJsonField from "@/components/hocs/mui/inputs/MuiJsonField.tsx";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";
import MyTextField from "@/components/hocs/mui/inputs/MyTextField.tsx";


interface AnalysisProps extends SteppableProps, FormROProps<WritingAnalysisDto>, FormWOPropsBeta<WritingAnalysisDto>, ResultROProps<string>, ResultWOPropsBeta<string> {
}


const Analysis: React.FC<AnalysisProps> = ({
                                             formData,
                                             setFormData,
                                             result,
                                             setResult,
                                           }) => {
  // context
  const routing = useContext(RoutingContext);

  // operation - analysis
  const handleAnalysis = async () => {
    if (!formData) {
      console.log('[analysis] No analysis forms specified.');
      return;
    }
    const _result = await analysis(
      routing,
      formData);
    if (!_result) {
      throw new Error(`[analysis] No analysis result returned. param: ${formData}`);
    }
    setResult(_result);
  };

  return (
    <>
      <MuiJsonField
        formData={formData}
        setFormData={setFormData}
        label="Submit"
      />

      <StyledMuiIconButton onClick={handleAnalysis}>
        <Search/>
      </StyledMuiIconButton>

      {result && <MyTextField
        isEditable={true}
        id={'analysis'}
        label={'analysis'}
        name={'analysis'}
        value={result}
        onChange={(event) => setResult(event.target.value)}
        fullWidth
        multiline
      />}
    </>
  );
}

export default Analysis;