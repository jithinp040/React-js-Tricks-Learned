import React, { Fragment, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Dropdown from './Dropdown';
import Button from './Button';

import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/AntDesign';
import { Table, Row, Cell, TableWrapper } from 'react-native-table-component';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { colors } from '../styles';

function Pagination(props) {
  const {
    items,
    labels,
    columnFlex,
    columnWidth,
    onRowSelect,
    errorMsg,
    renderItem,
    selectable,
    selectedRows,
  } = props;
  const checkBox = (value, index) => (
    <View style={styles.checkBoxStyling}>
      <CheckBox
        value={value}
        onValueChange={() => {
          changeChecked(index);
        }}
      />
    </View>
  );
  const isMountedRef = React.useRef(null);
  const headings = selectable ? ['Select', ...labels] || [] : labels || [];
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filesPerPage, setFilesPerPage] = React.useState('5');
  const [pageNumbers, setPageNumbers] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [constructed, setConstructed] = React.useState(false);
  const endIndex = currentPage * filesPerPage;
  const startIndex = endIndex - filesPerPage;
  const recordsPerPageSetting = ['5', '10', '25', '50'].map(item => ({
    label: item,
    value: item,
  }));
  const isDataTable = renderItem ? false : true;
  const error = errorMsg || 'No Data Provided';
  const [checked, setChecked] = React.useState(
    selectable
      ? items.map((item, index) => {
          if (selectedRows.includes(index)) {
            return true;
          } else {
            return false;
          }
        })
      : [],
  );
  const itemList = selectable
    ? items.map((item, index) => [checkBox(checked[index], index), ...item]) ||
      []
    : items || [];
  let currentPageContents = [];
  let tableWidth = [];
  if (itemList.length > 0 && isDataTable) {
    tableWidth = selectable
      ? [50, ...columnWidth] ||
        itemList[0].map(item => {
          if (typeof item === 'string') {
            return 100;
          }
          return 50;
        })
      : columnWidth ||
        itemList[0].map(item => {
          if (typeof item === 'string') {
            return 100;
          }
          return 50;
        });
  }
  React.useEffect(() => {
    isMountedRef.current = true;
    const onUnMounting = () => {
      isMountedRef.current = false;
    };
    return onUnMounting;
  }, []);

  React.useEffect(() => {
    if (isMountedRef.current) {
      setIsLoading(true);
    }
  }, [filesPerPage, items]);

  React.useEffect(() => {
    if (isMountedRef.current && isLoading) {
      if (items.length > 0) {
        let pageLength = Math.ceil(items.length / parseInt(filesPerPage));
        let pageNo = currentPage;
        while (pageNo > pageLength) {
          pageNo -= 1;
        }
        if (constructed) {
          setChecked(items.map(() => false));
        } else {
          setChecked(
            selectable
              ? items.map((item, index) => {
                  if (selectedRows.includes(index)) {
                    return true;
                  } else {
                    return false;
                  }
                })
              : [],
          );
        }
        if (onRowSelect && constructed) onRowSelect(0, []);
        setCurrentPage(pageNo);
        setPageNumbers(pageLength);
      }
      setIsLoading(false);
      setConstructed(true);
    }
  }, [isLoading]);

  const changeChecked = index => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    if (isMountedRef.current) {
      setChecked(newChecked);
      if (onRowSelect) {
        const selected = newChecked.reduce(
          (array, boolValue, index) =>
            boolValue ? array.concat(index) : array,
          [],
        );
        onRowSelect(index, selected);
      }
    }
  };

  const changeNoOfItems = value => {
    if (isMountedRef.current) {
      setFilesPerPage(value);
    }
  };

  const onGoNext = () => {
    if (isMountedRef.current) {
      if (currentPage < pageNumbers) {
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(pageNumbers);
      }
    }
  };

  const onGoPrevious = () => {
    if (isMountedRef.current) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setCurrentPage(1);
      }
    }
  };

  currentPageContents = itemList.slice(startIndex, endIndex);

  function DataTable() {
    return (
      <ScrollView horizontal>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: colors.primary }}>
            <Row
              data={headings}
              widthArr={tableWidth}
              style={{
                height: 50,
                backgroundColor: colors.primary,
              }}
              textStyle={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'white',
              }}
            />
          </Table>
          <GestureScrollView style={{ marginTop: -1 }}>
            <Table
              borderStyle={{ borderColor: colors.primary, borderWidth: 1 }}
            >
              {currentPageContents.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (selectable) {
                      changeChecked((currentPage - 1) * filesPerPage + index);
                    } else if (onRowSelect) {
                      onRowSelect((currentPage - 1) * filesPerPage + index);
                    } else {
                    }
                  }}
                >
                  <TableWrapper
                    style={[
                      {
                        borderTopWidth: 1,
                        borderColor: colors.primary,
                        flexDirection: 'row',
                      },
                      index % 2 === 0 && { backgroundColor: '#EFEFEF' },
                    ]}
                  >
                    {item.map((cell, subIndex) => (
                      <Cell
                        key={subIndex}
                        data={cell}
                        style={{
                          borderColor: colors.primary,
                          borderRightWidth: 1,
                          width: tableWidth[subIndex],
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingVertical: 5,
                        }}
                      />
                    ))}
                    {/* <Row
                    key={`DataTableContentId-${index}`}
                    data={item}
                    widthArr={tableWidth}
                    style={[
                      { height: 40 },
                      index % 2 && { backgroundColor: '#D5D8DC' },
                    ]}
                    textStyle={{ textAlign: 'center' }}
                  /> */}
                  </TableWrapper>
                </TouchableOpacity>
              ))}
            </Table>
          </GestureScrollView>
        </View>
      </ScrollView>
    );
  }

  function CustomData() {
    return (
      <View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          style={{ flexGrow: 0, margin: 15 }}
          horizontal
        >
          <View>
            <GestureScrollView style={{ marginTop: -1 }}>
              {currentPageContents.map((prop, index) => (
                <View key={`CustomPaginationContent${index}`}>
                  {renderItem(prop)}
                </View>
              ))}
            </GestureScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }

  function PaginationTools() {
    return (
      <View style={styles.paginationContainer}>
        {itemList.length > 5 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <View style={{ width: '35%', marginRight: 5 }}>
              <Dropdown
                items={recordsPerPageSetting}
                defaultValue={filesPerPage}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                bordered
                primary
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onChangeItem={value => {
                  changeNoOfItems(value.value);
                }}
              />
            </View>
            <Text>items per Page</Text>
          </View>
        )}
        {pageNumbers > 1 && (
          <View
            style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}
          >
            <Text style={{ color: colors.primary }}>
              {currentPage} / {pageNumbers}
            </Text>
            <Button
              bgColor={colors.white}
              textColor={colors.primary}
              onPress={onGoPrevious}
            >
              <View>
                <Icon name="left" color={colors.primary} size={15} />
              </View>
            </Button>
            <Button
              bgColor={colors.white}
              textColor={colors.primary}
              onPress={onGoNext}
            >
              <View>
                <Icon name="right" color={colors.primary} size={15} />
              </View>
            </Button>
          </View>
        )}
      </View>
    );
  }

  function NoData() {
    return (
      <View
        style={{
          marginVertical: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="exclamationcircle" color="#f00" size={20} />
        <Text
          style={{
            marginLeft: 10,
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        maxHeight: 400,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : (
        <Fragment>
          {itemList.length > 0 ? (
            <View>
              {isDataTable && DataTable()}
              {!isDataTable && CustomData()}
              {PaginationTools()}
            </View>
          ) : (
            NoData()
          )}
        </Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInputBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightGray,
    borderRadius: 5,
  },
  checkBoxStyling: { alignSelf: 'center', flex: 1, justifyContent: 'center' },
});

export default memo(Pagination);
