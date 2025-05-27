import heapq
from typing import List


class Solution:
    def lastStoneWeight(stones: List[int]) -> int:
        heap = []
        for stone in stones:
            heapq.heappush(heap, -stone)
        while len(heap) != 1:
            a = -heapq.heappop(heap)
            b = -heapq.heappop(heap)
            if a != b or len(heap) == 0:
                heapq.heappush(heap, -(a - b))
        return -heap[0]

    # Test cases
    print(lastStoneWeight(stones=[2, 4, 6, 9]))  # output should be 1
    print(lastStoneWeight(stones=[2, 2]))  # output should be 0
    print(lastStoneWeight(stones=[1, 2, 3, 4]))  # output should be 0
    print(lastStoneWeight(stones=[2, 4]))  # output should be 2
