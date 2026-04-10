import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import SimpleHeader from '../../../../components/SimpleHeader';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import AppText from '../../../../components/AppText';
import {responsiveWidth} from '../../../../utils/Responsive';
import AppButton from '../../../../components/AppButton';
import {ThemeColors} from '../../../../config/Theme';

const ApprovalScreen = () => {
  return (
    <View style={{flex: 1, paddingBottom: 100, backgroundColor: ThemeColors.Surface}}>
      <SimpleHeader title="Approval screen" />

    
    <FlatList
    data={[1, 2, 3, 4, 5]}
    renderItem={()=>{
        return(
        <View style={{
          padding: 20, 
          backgroundColor: ThemeColors.Surface, 
          borderRadius: 15,
          borderWidth: 1,
          borderColor: ThemeColors.Border,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3
          }}>
          <AppText title="Lorem ipsum" titleSize={2.2} titleColor={ThemeColors.TextMain} titleWeight/>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{gap: 10}}>
              <AppButton title="Approve" btnWidth={80} />
              <AppButton title="Disapprove" btnWidth={80} />
            </View>
          </View>

        </View>
        )
    }}
    />
      
    </View>
  );
};

export default ApprovalScreen;
