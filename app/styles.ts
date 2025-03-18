import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#00FF00',
  background: '#000000',
  text: '#FFFFFF',
  headerBg: '#333333',
  menuBg: '#222222',
  buttonBg: '#444444',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.headerBg,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    backgroundColor: colors.menuBg,
    padding: 15,
    marginVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: colors.text,
    marginLeft: 10,
  },
  button: {
    backgroundColor: colors.buttonBg,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: colors.text,
  },
  input: {
    backgroundColor: colors.menuBg,
    color: colors.text,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  chatRoom: {
    backgroundColor: colors.menuBg,
    padding: 10,
    marginVertical: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatRoomText: {
    color: colors.text,
  },
  message: {
    backgroundColor: colors.menuBg,
    padding: 10,
    marginVertical: 1,
  },
  messageText: {
    color: colors.text,
  },
  buddyItem: {
    backgroundColor: colors.menuBg,
    padding: 10,
    marginVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buddyName: {
    color: colors.text,
    marginLeft: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  online: {
    backgroundColor: '#00FF00',
  },
  offline: {
    backgroundColor: '#FF0000',
  },
});
