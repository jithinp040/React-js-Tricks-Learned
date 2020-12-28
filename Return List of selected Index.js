const selected = selectedCheckbox.reduce(
          (array, boolValue, index) => // where array is return value, boolvalue is element, index is the element index
            boolValue ? array.concat(index) : array, //combine result index with return value if found
          [],
        );
