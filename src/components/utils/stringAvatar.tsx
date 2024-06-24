/**
 * Get the avatar for a name
 *
 * @param {string} name - Name to convert to an avatar
 * @returns - Avatar for the name
 */
const stringAvatar = (name: string) => {
    return {
      color: 'brandColor.3',
      children: `${name.split(' ')[0][0]}${
        name.split(' ').length > 1 ? name.split(' ')[1][0] : ''
      }`.toUpperCase(),
    };
  };
  
  export default stringAvatar;
  