import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Paper,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { OrderCard } from '../components/order/OrderCard';
import { orderService } from '../services/order';
import { Order, OrderStatus } from '../types/order';
import {
  ORDER_FILTER_OPTIONS,
  calculateOrderStats,
} from '../data/mockOrders';
import Breadcrumb from '../components/common/Breadcrumb';

const OrderHistoryPage: React.FC = () => {
  // 상태 관리
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // 주문 목록 조회
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await orderService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError('주문 내역을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터링 적용
  useEffect(() => {
    let filtered = [...orders];

    // 탭 필터
    if (selectedTab !== 'ALL') {
      if (selectedTab === 'CANCELLED') {
        filtered = filtered.filter(
          order => order.status === 'CANCELLED' || order.status === 'REFUNDED'
        );
      } else {
        filtered = filtered.filter(order => order.status === selectedTab);
      }
    }

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.items.some(item =>
            item.product.name.toLowerCase().includes(query)
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedTab, searchQuery]);

  // 탭 변경
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  // 검색어 변경
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // 주문 취소 다이얼로그 열기
  const handleCancelClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  // 주문 취소 처리
  const handleCancelOrder = async () => {
    if (!selectedOrderId || !cancelReason.trim()) {
      return;
    }

    try {
      await orderService.cancelOrder({
        orderId: selectedOrderId,
        reason: cancelReason,
        refundMethod: 'ORIGINAL',
      });

      // 주문 목록 새로고침
      await fetchOrders();

      // 다이얼로그 닫기
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedOrderId(null);

      alert('주문이 취소되었습니다.');
    } catch (err) {
      console.error(err);
      alert('주문 취소에 실패했습니다.');
    }
  };

  // 배송 추적
  const handleViewTracking = (orderId: number) => {
    // 주문 상세 페이지로 이동 (배송 추적 섹션)
    window.location.href = `/orders/${orderId}#tracking`;
  };

  // 통계 계산
  const stats = calculateOrderStats(orders);

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    { label: '마이페이지', href: '/my-page' },
    { label: '주문 내역', current: true },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* 브레드크럼 */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* 페이지 헤더 */}
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          주문 내역
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          총 {stats.total}건의 주문 내역이 있습니다.
        </Typography>

        {/* 주문 통계 */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={4} justifyContent="center">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.pending + stats.confirmed + stats.preparing}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                처리 중
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {stats.shipped}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                배송 중
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.delivered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                배송 완료
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary" fontWeight="bold">
                {stats.cancelled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                취소/환불
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* 검색 및 필터 */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="주문번호 또는 상품명으로 검색"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Paper>

        {/* 주문 상태 탭 */}
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {ORDER_FILTER_OPTIONS.map(option => (
              <Tab
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Tabs>
        </Paper>

        {/* 로딩 상태 */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* 에러 상태 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 주문 목록 */}
        {!isLoading && !error && (
          <>
            {filteredOrders.length === 0 ? (
              <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {searchQuery
                    ? '검색 결과가 없습니다.'
                    : '주문 내역이 없습니다.'}
                </Typography>
                {!searchQuery && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => (window.location.href = '/')}
                  >
                    쇼핑 시작하기
                  </Button>
                )}
              </Paper>
            ) : (
              <Box>
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onCancel={handleCancelClick}
                    onViewTracking={handleViewTracking}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Container>

      {/* 주문 취소 다이얼로그 */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>주문 취소</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            주문을 취소하시겠습니까? 취소 사유를 입력해주세요.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="취소 사유를 입력하세요"
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelOrder}
            disabled={!cancelReason.trim()}
          >
            주문 취소
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderHistoryPage;
