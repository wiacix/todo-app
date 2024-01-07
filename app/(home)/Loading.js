import { Text, View, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';

const Loading = (props) => {

    // Animacja rotacji
  const rotateValue = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    animatedRotation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    )
    animatedRotation.start();
  };
  
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if(props.isLoading) startRotation();
  else animatedRotation.stop();


    return (
      <View style={{ justifyContent:'center', alignItems:'center', position: 'absolute', width:'100%', height:'100%', backgroundColor: '#00000070'}}>
          <Animated.View style={{ justifyContent:'center', alignItems:'center', gap:10, transform: [{ rotate: spin }]}}>
              <FontAwesome5 name="hourglass" size={86} color="#120907" />
          </Animated.View>
          <Text style={{ fontSize:20, fontWeight:600, color: '#120907'}}>Loading...</Text>
      </View>
    )
}

export default Loading
