import { testingPhone } from "modules/constants";
import { useDesignScale } from "modules/hooks";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { appColors } from "../assets/colors";
import { GradientListContainer } from "../components/GradientListContainer";
import { StyledButton } from "../components/StyledButton";
import { StyledInput } from "../components/StyledInput";
import { Title2022 } from "../components/Title2022";

export function PasswordResetScreen() {
    const {appStyles, HEIGHT} = useDesignScale()
    const [phone, setPhone] = useState(__DEV__?testingPhone:'')
    return (
        <GradientListContainer>
            <View style={{flex: 1, alignItems: 'center', marginHorizontal: 40}}>
                <Text style={[appStyles.text19, {color: appColors.grey, textAlign: 'center', marginTop: HEIGHT(200)}]}>Forgot password</Text>
                <StyledInput
                    style={{marginTop: 32}}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType='phone-pad'
                    placeholder='Phone' />
                <StyledButton
                    style={{marginTop: 32}}
                    enabled={phone?true:false}
                    title='RESET PASSWORD'
                    onPress={()=>{

                    }}
                />
                <Title2022/>
            </View>
        </GradientListContainer>
    )
}