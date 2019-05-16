import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import Header from '../../components/widget/Header';
import Loading from '../../components/widget/Loading';
import Button from '../../components/widget/Button';
import Icon from 'react-native-vector-icons/AntDesign';
import { common, variable } from '../../styles/index';
import { getBookDetail } from '../../services/books';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '图书详情',
      loading: false,
      detailInfo: {},
      book: {},
      numberOfLines: 3
    };
  }

  componentDidMount() {
    this._getBookDetail();
  }

  async _getBookDetail() {
    try {
      const { book } = this.props.navigation.state.params || {};
      this.setState({ loading: true, book: book || {} });
      const detailInfo = await getBookDetail({ book_id: book.book_id });
      this.setState({ detailInfo });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  _renderCardTags = () => {
    const { tags } = this.state.detailInfo;
    if (tags && tags.length) {
      return (
        <View style={styles.card_tags}>
          {tags.map((tag, index) => {
            if (index < 3) {
              return (
                <View style={styles.card_tag} key={index}>
                  <Text style={styles.card_tag_text} numberOfLines={1}>
                    {tag}
                  </Text>
                </View>
              );
            }
          })}
        </View>
      );
    }
  };

  _renderTopCard = () => {
    const { title, authors, summary, cover } = this.state.book;
    return (
      <View style={{ flexDirection: 'row', marginBottom: 48 }}>
        <View style={styles.card_img_wraper}>
          <Image source={{ uri: cover }} style={styles.card_img} />
        </View>
        <View style={styles.card_content}>
          <Text style={common.fontColorSize('#333', 18)} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.card_authors} numberOfLines={1}>
            {this.state.detailInfo.authors || authors}
          </Text>
          <Text style={styles.card_summary} numberOfLines={2}>
            {summary}
          </Text>
          {this._renderCardTags()}
        </View>
      </View>
    );
  };

  _renderBookIntroduction = () => {
    if (this.state.detailInfo.introduction) {
      return (
        <View>
          <Text style={styles.block_title}>简介</Text>
          <View style={styles.block_content}>
            <Text
              style={styles.block_content_text}
              numberOfLines={this.state.numberOfLines}
              ellipsizeMode='middle'
            >
              {this.state.detailInfo.introduction}
            </Text>
            {this.state.numberOfLines < 4 && (
              <Text
                onPress={() => {
                  this.setState({ numberOfLines: 1000 });
                }}
                style={common.fontColorSize('#5E94FF', 14)}
              >
                更多
              </Text>
            )}
          </View>
        </View>
      );
    }
  };

  _renderAuthorsIntroduction = () => {
    const { authors_introduction } = this.state.detailInfo;
    if (authors_introduction && authors_introduction.length) {
      return (
        <View>
          <Text style={styles.block_title}>作者简介</Text>
          <View style={styles.block_content}>
            {authors_introduction.map((author, index) => {
              return (
                <Text style={styles.block_content_text} key={index}>
                  <Text>
                    {author.name}
                    {`\n`}
                  </Text>
                  <Text>{author.introduction}</Text>
                </Text>
              );
            })}
          </View>
        </View>
      );
    }
  };

  _renderSimpleInformation = () => {
    const {
      copyright,
      price,
      publication_date,
      score,
      word_count
    } = this.state.detailInfo;
    return (
      <View style={styles.simpleInformation}>
        <Text>版权：{copyright}</Text>
        <Text>价格：{price}</Text>
        <Text>出版时间：{publication_date}</Text>
        <Text>评分：{score}</Text>
        <Text>字数：{word_count}</Text>
      </View>
    );
  };

  _renderBottomOperate = () => {
    // pluscircleo pluscircle
    // staro star
    return (
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.bottom_item}>
          <Icon
            name='pluscircleo'
            style={common.fontColorSize('#D8D8D8', 20)}
          />
          <Text style={styles.bottom_text}>加入书架</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottom_item}>
          <Icon name='staro' style={common.fontColorSize('#D8D8D8', 20)} />
          <Text style={styles.bottom_text}>收藏</Text>
        </TouchableOpacity>
        <Button
          title='立即阅读'
          style={{
            touch: {
              ...common.screenWidth(160 / 375),
              height: 36
            }
          }}
        />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={[common.flex(), common.bgc()]}>
        <Header title={this.state.book.title} navigation={navigation} />
        <ScrollView>
          <View style={{ padding: 16, flex: 1 }}>
            {this._renderTopCard()}
            {this._renderBookIntroduction()}
            {this._renderAuthorsIntroduction()}
            {this._renderSimpleInformation()}
          </View>
        </ScrollView>
        {this._renderBottomOperate()}
        <Loading visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  /** 图书卡片 */
  card_img_wraper: {
    ...common.border(),
    ...common.shadow(2, variable.$ios_box_shadow_book),
    ...common.screenHeight(140 / 812),
    ...common.screenWidth(100 / 375)
  },
  card_img: {
    ...common.screenHeight(140 / 812),
    ...common.screenWidth(100 / 375)
  },
  card_content: {
    marginLeft: 12,
    paddingRight: 16,
    flexDirection: 'column',
    width: common.screenWidth(246 / 375)['width']
  },
  card_authors: {
    ...common.fontColorSize('#697B84', 14),
    marginTop: 12,
    marginBottom: 12
  },
  card_summary: {
    ...common.fontColorSize('#BEC2C8', 14),
    lineHeight: 20
  },
  card_tags: {
    flexDirection: 'row',
    marginTop: 12
  },
  card_tag: {
    maxWidth: 70,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F5F7F9',
    marginRight: 8,
    paddingHorizontal: 10
  },
  card_tag_text: {
    ...common.fontColorSize('#697B84', 12),
    textAlign: 'center'
  },

  /** 块 */
  block_title: {
    ...common.fontColorSize('#2C2C2C', 16),
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'left'
  },
  block_content: {
    flexDirection: 'column',
    marginBottom: 24
  },
  block_content_text: {
    ...common.screenWidth(342 / 375),
    ...common.fontColorSize('#697B84', 14),
    lineHeight: 20
  },

  /** 信息表 */
  simpleInformation: {
    ...common.screenWidth(343 / 375),
    ...common.bgc('#F9F9F9'),
    minHeight: 100,
    borderRadius: 8,
    padding: 16
  },

  /** 底部操作 */
  bottom: {
    ...common.screenWidth(),
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 11,
    marginBottom: common.isIphoneX() ? 34 : 0,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    flexDirection: 'row',
    elevation: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  bottom_item: {
    flexDirection: 'column',
    marginRight: 43,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottom_text: {
    ...common.fontColorSize('#697B84', 12),
    textAlign: 'center',
    marginTop: 2
  }
});

export default Detail;
