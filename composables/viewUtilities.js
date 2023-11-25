export const useViewUtilities = () => {
  function reverseEngineerID(generatedID) {
    const namePart = generatedID.replace(/-[\da-f]+$/, "").split("-");
  
    const formattedName = namePart.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  
    return formattedName;
  }
  

  return {
    reverseEngineerID
  }
}