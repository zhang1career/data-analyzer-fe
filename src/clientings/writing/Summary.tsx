import React, {useContext, useEffect, useState} from "react";
import {summary} from "@/io/WritingIO.ts";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {SteppableProps} from "@/defines/combines/SteppableProps.ts";
import {ResultROProps} from "@/defines/abilities/ResultROProps.ts";
import {ResultWOPropsBeta} from "@/defines/abilities/ResultWOPropsBeta.ts";
import {StyledMuiIconButton} from "@/components/styled/buttons/StyledMuiIconButton.tsx";
import {Search} from "@mui/icons-material";
import MuiJsonField from "@/components/hocs/mui/inputs/MuiJsonField.tsx";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";
import MuiTextField from "@/components/hocs/mui/inputs/MuiTextField.tsx";
import {WritingSummaryDto} from "@/pojo/dto/WritingSummaryDto.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";


interface SummaryProps extends SteppableProps, FormROProps<WritingSummaryDto>, FormWOPropsBeta<WritingSummaryDto>, ResultROProps<string>, ResultWOPropsBeta<string> {
}


const Summary: React.FC<SummaryProps> = ({
                                           formData,
                                           setFormData,
                                           result,
                                           setResult,
                                         }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // error
  const [error, setError] = useState<string | null>(null);
  // notice error
  useEffect(() => {
    if (!error) {
      return;
    }
    noticing(error, {
      severity: 'error',
      autoHideDuration: NOTICE_TTL_LONG,
    });
  }, [error, noticing]);

  // operation - summary
  const handleSummary = async () => {
    if (!formData) {
      console.log('[summary] No summary forms specified.');
      return;
    }
    const _result = await summary(
      routing,
      formData);
    if (!_result) {
      throw new Error(`[summary] No analysis result returned. param: ${formData}`);
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

      <StyledMuiIconButton onClick={handleSummary}>
        <Search/>
      </StyledMuiIconButton>

      {result && <MuiTextField
        isEditable={true}
        id={'summary'}
        label={'summary'}
        name={'summary'}
        value={result}
        onChange={(event) => setResult(event.target.value)}
        fullWidth
        multiline
      />}
    </>
  );
}

export default Summary;