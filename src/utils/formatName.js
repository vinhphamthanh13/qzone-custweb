const formatName = ({ givenName, familyName }) => `${givenName || ''}${familyName ? ` ${familyName}` : ''}`;

export default formatName;
