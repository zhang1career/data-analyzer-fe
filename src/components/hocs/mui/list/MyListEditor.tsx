import React, {useState} from "react";
import {Box, Button} from "@mui/material";
import {styled} from '@mui/material/styles';
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from '@mui/icons-material/Clear';
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import {InputValueProps} from "@/defines/combines/InputValueProps.ts";
import {COLOR, GREY} from "@/lookings/color.ts";


interface WrappedComponentProps<V> extends FormRWProps<V> {
}

interface ListEditorProps<V> extends FormRWProps<V[]>, InputValueProps<V> {
}

export const withListEditor = <V, P>(
  WrappedComponent: React.ComponentType<WrappedComponentProps<V> & P>
): React.FC<ListEditorProps<V> & P> => {
  // eslint-disable-next-line react/display-name
  return ({
            formData,
            setFormData,
            checkBlank,
            getTrimmedValue = (data: V) => data,
            ...rest
          }: ListEditorProps<V>) => {
    // edit item
    const [inputValue, setInputValue] = useState<V | null>(null);
    // refresh input
    const [activeInputAt, setActiveInputAt] = useState(Date.now());

    const handleAddItem = () => {
      if (checkBlank(inputValue)) {
        return;
      }

      // @ts-ignore
      const newItemList = [getTrimmedValue(inputValue), ...(formData ?? [])];

      setFormData(newItemList);
      setInputValue(null);
      setActiveInputAt(Date.now());
    };

    const handleDeleteItem = (targetIndex: number) => {
      const newItems = formData?.filter((_, _index) => _index !== targetIndex);
      setFormData(newItems?.length ? newItems : []);
    };

    // styled components
    const RoundButton = styled(Button)({
      width: '30px',
      height: '30px',
      borderRadius: '100%',
    });


    return (
      <Box sx={{width: '100%', padding: 2}}>
        {/* Input Field and Add Button */}
        <Box
          sx={(theme) => ({
            display: 'flex',
            bgcolor: COLOR['white'],
            color: COLOR['white'],
            padding: 2,
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
            marginX: "auto",
            marginBottom: 2,
            boxShadow: 10,
            ...theme.applyStyles('dark', {
              bgcolor: '#101010',
              color: GREY['300'],
            }),
          })}
        >
          <WrappedComponent
            formData={inputValue}
            setFormData={(_newFormData) => {
              setInputValue(_newFormData);
            }}
            key={activeInputAt}
            {...(rest as P)}
          />
          <RoundButton
            startIcon={<AddIcon/>}
            color='primary'
            onClick={handleAddItem}
            sx={{width: '30px', height: '30px', marginX: "auto", marginY: "auto"}}
          />
        </Box>

        {/* List of Items */}
        <Box
          sx={{display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'left'}}
        >
          <>
            {formData?.map((item, _i) => (
              <Box
                sx={{
                  display: 'flex',
                  bgcolor: COLOR['white'],
                  color: COLOR['white'],
                  padding: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  width: "95%",
                  marginX: "auto",
                }}
                key={_i}
              >
                <WrappedComponent
                  formData={item}
                  setFormData={(_newItem) => {
                    setFormData(formData
                      ? formData.map((_oldItem, _oldI) => _i === _oldI ? _newItem : _oldItem)
                      : [_newItem]
                    );
                  }}
                  {...(rest as P)}
                />
                <RoundButton
                  startIcon={<ClearIcon/>}
                  variant='contained'
                  color='error'
                  onClick={() => handleDeleteItem(_i)}
                  sx={{p: 0, m: 0, marginX: 'auto', marginY: 'auto'}}
                />
              </Box>
            ))}
          </>
        </Box>
      </Box>
    );
  };
};