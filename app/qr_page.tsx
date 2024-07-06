import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from "../utils/supabase";
import QRCode from 'react-native-qrcode-svg';

// Custom styling
import { Buttons } from '../constants/Buttons'
import { Texts } from '../constants/Texts'

export default function Tab() {
  const [okQrValue, setOkQRValue] = useState<string | null>(null);
  const [usedQrValue, setUsedQRValue] = useState<string | null>(null);
  const [otherOrgQrValue, setOtherOrgQRValue] = useState<string | null>(null);
  const [errorQrValue, setErrorQRValue] = useState<string | null>(null);

  useEffect(() => {
    getNewQrCodes();
  }, []);

  const getNewQrCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('qr')
        .select('id')
        .eq('already_validated', false)
        .limit(1)
        .single();
  
      if (error) {
        throw error;
      } else {
        console.log('Data from Supabase:', data);

        setOkQRValue(data.id);
      }
    } catch (error: any) {
      console.error('Error fetching data from Supabase:', error.message);
    }

	  try {
      const { data, error } = await supabase
        .from('qr')
        .select('id')
        .eq('already_validated', true)
        .limit(1)
        .single();
    
      if (error) {
        throw error;
      } else {
        console.log('Data from Supabase:', data);
    
        setUsedQRValue(data.id);
      }
	  } catch (error: any) {
		  console.error('Error fetching data from Supabase:', error.message);
	  }

	  try {
      const { data, error } = await supabase
        .from('qr')
        .select('id')
        .neq('organization_id', '0896e1ff-705d-45a3-9936-1cb2d90686f3')
        .limit(1)
        .single();
    
      if (error) {
        throw error;
      } else {
        console.log('Data from Supabase:', data.id);
    
        setOtherOrgQRValue(data.id);
      }
	  } catch (error: any) {
		console.error('Error fetching data from Supabase:', error.message);
	  }
  
	setErrorQRValue('6ff85937-37ad-47b2-9098-291edaa19041'); // This is a fake UUID, might exist in the database later but it's not worth checking

  };
  
  return (
    <View style={styles.container}>
      
	  	{okQrValue ?
			<View style={styles.qrContainer}>
				<Text style={[Texts.text, styles.qrTitles]}>Ok QR code</Text>
				<QRCode
					value={okQrValue}
					size={250}
					color="black"
					backgroundColor="white" />
			</View>
			: <Text style={Texts.text}>Error in ok qr code</Text>
		}

		{usedQrValue ?
			<View style={styles.qrContainer}>
				<Text style={[Texts.text, styles.qrTitles]}>Used QR code</Text>
				<QRCode
					value={usedQrValue}
					size={250}
					color="black"
					backgroundColor="white" />
			</View>
			: <Text style={Texts.text}>Error in used qr code</Text>
		}

		{otherOrgQrValue ?
			<View style={styles.qrContainer}>
				<Text style={[Texts.text, styles.qrTitles]}>Other org QR code</Text>
				<QRCode
					value={otherOrgQrValue}
					size={250}
					color="black"
					backgroundColor="white" />
			</View>
			: <Text style={Texts.text}>Error in other org qr code</Text>
		}

		{errorQrValue ?
			<View style={styles.qrContainer}>
        <Text style={[Texts.text, styles.qrTitles]}>Error QR code</Text>
				<QRCode
					value={errorQrValue}
					size={250}
					color="black"
					backgroundColor="white" />
			</View>
			: <Text style={Texts.text}>Error in error qr code</Text>
		}
      
    <TouchableOpacity activeOpacity={0.8} onPress={getNewQrCodes} style={[Buttons.button, { position: 'absolute', bottom:20 }]}>
      <Text style={ Buttons.buttonText }>Fetch qr codes</Text>
    </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  qrTitles: {
    fontSize: 20,
    marginBottom: 10,
  }
});
